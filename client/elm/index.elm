module Main exposing (..)

import Debug exposing (log)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (type_)
import Html.Events exposing (onClick)
import Json.Decode exposing (decodeString, field, value)
import Json.Encode exposing (encode, object)
import WebSocket exposing (..)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { username : String
    , loginError : String
    , guid : String
    , messages : List String
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


type alias SocketMessage =
    { type_ : String
    , username : String
    , guid : String
    }


type alias SendLogin =
    { username : String
    , guid : String
    }


type alias SocketError =
    {}


type Msg
    = SEND_LOGIN
    | USER_LOGIN
    | GET_MESSAGE
    | SEND_MESSAGE
    | GET_USERS
    | USER_LOGOUT
    | SOCKET_MESSAGE String


parseResponse : String -> SocketError
parseResponse response =
    let
        msgType =
            log "type" (Json.Decode.decodeString (Json.Decode.field "type" Json.Decode.string) response)

        msgStatus =
            log "status" (Json.Decode.decodeString (Json.Decode.field "status" Json.Decode.string) response)
    in
    case msgType of
        "login" ->
            case msgStatus of
                "error" ->
                    log "login_error" (Json.Decode.decodeString (Json.Decode.field "message" Json.Decode.string) response)

                "" ->
                    log "" 1


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SEND_LOGIN ->
            let
                payload =
                    { username = "timan", guid = "123" }
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
                msgType =
                    log "type" (Json.Decode.decodeString (Json.Decode.field "type" Json.Decode.string) response)

                msgData =
                    log "data" (Json.Decode.decodeString (Json.Decode.field "payload" Json.Decode.value) response)
            in
            ( model, Cmd.none )



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
