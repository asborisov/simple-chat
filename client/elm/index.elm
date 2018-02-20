module Main exposing (..)

import ChatInterface exposing (message)
import Date
import Debug exposing (log)
import DecodeResponse exposing (ReturnResult(..), parseMessage)
import EncodeRequest exposing (LoginPayload, Payload(..), encodeRequest)
import Html exposing (Html, button, div, input, label, text)
import Html.Attributes exposing (placeholder, style, type_, value)
import Html.Events exposing (onClick, onInput, on, keyCode)
import Json.Decode exposing (decodeString, field)
import Json.Encode exposing (encode, object)
import WebSocket exposing (..)
import Ports.LocalStorage exposing (..)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias ChatMessage =
    { timeStamp : Date.Date
    , text : String
    , author : String
    }


type alias Model =
    { username : String
    , loginError : String
    , guid : String
    , chatText : String
    , messages : List ChatMessage
    , users : List String
    }


defaultModel : Model
defaultModel =
    Model "" "" "" "" [] []


init : ( Model, Cmd Msg )
init =
    ( defaultModel, Cmd.none )


chatServer : String
chatServer =
    "ws://localhost:3000"



-- UPDATE


type Msg
    = SEND_LOGIN
    | USER_LOGIN
    | GET_MESSAGE
    | SEND_MESSAGE
    | GET_USERS
    | USER_LOGOUT
    | SOCKET_MESSAGE String
    | InputName String
    | InputMsg String


sendLogin : Model -> ( Model, Cmd Msg )
sendLogin model =
    let
        payload =
            { username = model.username, guid = "" }
    in
    if String.isEmpty payload.username == True then
        ( { model | loginError = "Wrong login!" }, Cmd.none )
    else
        let
            message =
                encodeRequest (Login (LoginPayload payload.username payload.guid))
        in
        ( { model | loginError = "" }, WebSocket.send chatServer message )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        InputName name ->
            ( { model | username = name }, Cmd.none )

        InputMsg text ->
            ( { model | chatText = text }, Cmd.none )

        SEND_LOGIN ->
            sendLogin model

        USER_LOGIN ->
            ( model, Cmd.none )

        GET_MESSAGE ->
            ( model, Cmd.none )

        SEND_MESSAGE ->
            let
                message =
                    encodeRequest (Message model.chatText)
            in
            ( { model | chatText = "" }, WebSocket.send chatServer message )

        GET_USERS ->
            ( model, Cmd.none )

        USER_LOGOUT ->
            ( model, Cmd.none )

        SOCKET_MESSAGE response ->
            case parseMessage response of
                LoginSuccess l ->
                    ( { model | guid = l.guid, username = l.username }, Cmd.none )

                MessageRes m ->
                    ( { model | messages = model.messages ++ [ ChatMessage m.timeStamp m.text m.author ] }, Cmd.none )

                UsersListRes users_ ->
                    ( { model | users = users_ }, Cmd.none )

                _ ->
                    ( model, Cmd.none )


resultToString : ReturnResult -> String
resultToString result =
    case result of
        MessageRes msg ->
            "ts: " ++ toString msg.timeStamp ++ "text: " ++ msg.text

        LoginSuccess login ->
            "User " ++ login.username ++ " logged in: " ++ login.guid

        UsersListRes users ->
            "Users: [" ++ toString users ++ "]"

        LoginFail fail ->
            toString fail.message

        Error err ->
            toString err



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen chatServer SOCKET_MESSAGE



-- VIEW

onEnter : Msg -> Html.Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                Json.Decode.succeed msg
            else
                Json.Decode.fail "not ENTER"
    in
        on "keydown" (Json.Decode.andThen isEnter keyCode)


loginStyle =
    [ ( "position", "absolute" )
    , ( "top", "50%" )
    , ( "left", "50%" )
    , ( "transform", "translate(-50%, -50%)" )
    , ( "textAlign", "center" )
    , ( "padding", "1px" )
    ]

loginView : Model -> Html Msg
loginView model =
    div [ style loginStyle ]
        [ input [ type_ "text", placeholder "Enter you login", onInput InputName, onEnter SEND_LOGIN ] []
        , input [ type_ "button", onClick SEND_LOGIN, value "Enter" ] []
        ]


chatStyle =
    [ ( "display", "flex" ), ( "flexDirection", "row" ), ( "height", "90vh" ) ]


usersListStyle =
    [ ( "width", "20%" ), ( "padding", "0.5em" ) ]


messagesListStyle =
    [ ( "width", "80%" ), ( "overflow-x", "hidden" ), ( "overflow-y", "auto" ) ]


bottomStyle =
    [ ( "height", "calc(10vh - 1em)" ), ( "margin", "0.5em") ]

bottomInputStyle =
    [ ( "width", "80vw" ) ]

bottomButtonStyle =
    [ ("margin", "0 0.5em") ]


chatView : Model -> Html Msg
chatView model =
    let
        users =
            List.map (\user -> div [] [ text user ]) model.users

        messages =
            List.map ChatInterface.message model.messages
    in
    div []
        [ div [ style chatStyle ]
            [ div [ style usersListStyle ]
                [ label [] [ text "Users online:" ]
                , div [] users
                ]
            , div [ style messagesListStyle ] messages
            ]
        , div [ style bottomStyle ]
            [ input [ type_ "text", style bottomInputStyle, onInput InputMsg, onEnter SEND_MESSAGE, value model.chatText ] []
            , input [ type_ "button", style bottomButtonStyle, onClick SEND_MESSAGE, value "Send" ] []
            ]
        ]


view : Model -> Html Msg
view model =
    case String.isEmpty model.guid of
        True ->
            loginView model

        False ->
            chatView model
