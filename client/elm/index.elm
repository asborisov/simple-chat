module Main exposing (..)

import Debug exposing (log)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)
import Date
import Json.Decode exposing (decodeString, field, value)
import Json.Encode exposing (encode, object)
import WebSocket exposing (..)
import ParseResponse exposing (parseMessage, ReturnResult (..))


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

type alias ChatMessage =
    { timeStamp: Date.Date
    , text: String
    }

type alias Model =
    { username : String
    , loginError : String
    , guid : String
    , messages : List ChatMessage
    , users : List String
    }


defaultModel : Model
defaultModel =
    Model "" "" "" [] []


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SEND_LOGIN ->
            let
                payload =
                    { username = "timan4", guid = "110553e1-1075-11e8-bac9-7993c0cdca52" }
            in
            if String.isEmpty payload.username == True then
                ( { model | loginError = "Wrong login!" }, Cmd.none )
            else
                let
                    message =
                        [ ( "type", Json.Encode.string "login" ), ( "username", Json.Encode.string payload.username ), ( "guid", Json.Encode.string payload.guid ) ]
                            |> Json.Encode.object
                            |> Json.Encode.encode 0
                in
                ( { model | loginError = "" }, WebSocket.send chatServer message )

        USER_LOGIN ->
            ( model, Cmd.none )

        GET_MESSAGE ->
            ( model, Cmd.none )

        SEND_MESSAGE ->
            ( model, Cmd.none )

        GET_USERS ->
            ( model, Cmd.none )

        USER_LOGOUT ->
            ( model, Cmd.none )

        SOCKET_MESSAGE response ->
            let
                result = parseMessage response
            in
                case result of
                    MessageRes m -> ( { model | messages = model.messages ++ [(ChatMessage m.timeStamp m.text)] }, Cmd.none)
                    UsersListRes users_ -> ({ model | users = users_ }, Cmd.none)
--                    LoginSuccess login -> ({ model |  })
                    _ -> ( model, Cmd.none )


resultToString : ReturnResult -> String
resultToString result =
    case result of
        MessageRes msg ->
            "ts: " ++ toString msg.timeStamp ++ "text: " ++ msg.text

        LoginSuccess login ->
            "User " ++ login.user ++ " logged in: " ++ login.guid

        UsersListRes users ->
            "Users: [" ++ toString users ++ "]"

        Error err ->
            toString err


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen chatServer SOCKET_MESSAGE



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ input [ type_ "button", onClick SEND_LOGIN ] [ text "Click me" ]
        ]
