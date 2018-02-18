module Main exposing (..)

import Date
import Debug exposing (log)
import DecodeResponse exposing (ReturnResult(..), parseMessage)
import EncodeRequest exposing (LoginPayload, Payload(..), encodeRequest)
import Html exposing (Html, button, div, input, label, text)
import Html.Attributes exposing (placeholder, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Json.Decode exposing (decodeString, field)
import Json.Encode exposing (encode, object)
import WebSocket exposing (..)


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
--    , author : String
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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        InputName name ->
            ( { model | username = name }, Cmd.none )

        InputMsg text ->
            ( { model | chatText = text }, Cmd.none )

        SEND_LOGIN ->
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
            case (parseMessage response) of
                LoginSuccess l ->
                    ( { model | guid = l.guid, username = l.username }, Cmd.none )

                MessageRes m ->
                    ( { model | messages = model.messages ++ [ ChatMessage m.timeStamp m.text ] }, Cmd.none )

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


loginView : Model -> Html Msg
loginView model =
    div []
        [ input [ type_ "text", placeholder "User name", onInput InputName ] []
        , input [ type_ "button", onClick SEND_LOGIN, value "Login" ] []
        ]


chatStyle =
    [ ( "display", "flex" ), ( "flexDirection", "row" ), ( "height", "90vh" ) ]


usersListStyle =
    [ ( "width", "20vw" ) ]


messagesListStyle =
    [ ( "width", "80vw" ) ]


inputStyle =
    [ ( "height", "10vh" ) ]


chatView : Model -> Html Msg
chatView model =
    let
        users =
            List.map (\user -> div [] [ text user ]) model.users

        messages =
            List.map (\message -> div [] [ text message.text ]) model.messages
    in
    div []
        [ div [ style chatStyle ]
            [ div [ style usersListStyle ]
                [ label [] [ text "Users online:" ]
                , div [] users
                ]
            , div [ style messagesListStyle ] messages
            ]
        , div [ style inputStyle ]
            [ input [ type_ "text", onInput InputMsg ] []
            , input [ type_ "button", onClick SEND_MESSAGE, value "Send" ] []
            ]
        ]


view : Model -> Html Msg
view model =
    case String.isEmpty model.guid of
        True ->
            loginView model

        False ->
            chatView model
