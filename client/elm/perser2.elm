--module ParseResponse exposing (parseResponseType)


module Main exposing (..)

import Date exposing (Date, fromString)
import Html exposing (Html, br, div, text)
import Json.Decode exposing (Decoder)
import Result exposing (andThen)


--type alias Message =
--    { timeStamp : Date.Date
--    , author : String
--    , uid : String
--    , text : String
--    }


type ResponseType
    = LOGIN
    | MESSAGE
    | USERS_LIST


type ErrorType
    = ERROR_PARSE
    | UNKNOWN_TYPE


type alias Message =
    { timeStamp : Date
    , text : String
    }


type alias Login =
    { user : String
    , text : String
    }


type ReturnResult
    = MessageRes Message
    | LoginRes Login
    | Error ErrorType


timestampToDate : Decoder Date
timestampToDate =
    Json.Decode.float
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (Date.fromTime val))


messageDecoder : Decoder ReturnResult
messageDecoder =
    Json.Decode.map2 Message
        (Json.Decode.field "ts" timestampToDate)
        (Json.Decode.field "text" Json.Decode.string)
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (MessageRes val))


loginDecoder : Decoder ReturnResult
loginDecoder =
    Json.Decode.map2 Login
        (Json.Decode.field "user" Json.Decode.string)
        (Json.Decode.field "text" Json.Decode.string)
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (LoginRes val))


decoder : String -> Decoder ReturnResult
decoder type_ =
    case type_ of
        "message" ->
            messageDecoder

        "login" ->
            loginDecoder

        _ ->
            Json.Decode.fail "Unknown type"


parseMessage : String -> ReturnResult
parseMessage input =
    let
        messageType =
            Result.withDefault "" (Json.Decode.decodeString (Json.Decode.field "type" Json.Decode.string) input)
    in
    input
        |> Json.Decode.decodeString (decoder messageType)
        |> (\res ->
                case res of
                    Ok okRes ->
                        okRes

                    Err err ->
                        Error ERROR_PARSE
           )


resultToString : ReturnResult -> String
resultToString result =
    case result of
        MessageRes msg ->
            "ts: " ++ toString msg.timeStamp ++ "text: " ++ msg.text

        LoginRes login ->
            "User " ++ login.user ++ " logged in: " ++ login.text

        Error err ->
            toString err


main : Html msg
main =
    div []
        [ text (resultToString (parseMessage "{\"type\": \"message\",  \"ts\": \"1518165045444\", \"text\": \"Hello!\"}"))
        , br [] []
        , text (resultToString (parseMessage "{\"type\": \"message\", \"ts\": 1518165045444, \"text\": \"Hello!\"}"))
        , br [] []
        , text (resultToString (parseMessage "{\"type\": \"login\", \"ts\": 1518165045444, \"text\": \"Hello!\", \"user\": \"timan\"}"))
        ]
