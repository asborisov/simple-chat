module Chat.DecodeResponse exposing (parseMessage, ReturnResult (..), ErrorType (..), Message, Login)

--module Main exposing (..)

import Date exposing (Date, fromString)
import Html exposing (Html, br, div, text)
import Json.Decode exposing (Decoder)
import Result exposing (andThen)


type alias Message =
    { timeStamp : Date.Date
    , author : String
    , uid : String
    , text : String
    }

type alias Login =
    { username : String
    , guid : String
    }

type alias LoginError =
    { code: Int
    , message: String
    }

type alias LoginResponse =
    { username : Maybe String
    , guid : Maybe String
    , status: String
    , message: Maybe String
    , code: Maybe Int
    }

type alias UsersList = List String

type ErrorType
    = ERROR_PARSE
    | UNKNOWN_TYPE
    | LOGIN_ERROR String

type ReturnResult
    = MessageRes Message
    | LoginSuccess Login
    | LoginFail LoginError
    | UsersListRes UsersList
    | Error ErrorType

--type Msg =



timestampToDate : Decoder Date
timestampToDate =
    Json.Decode.float
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (Date.fromTime val))


messageDecoder : Decoder ReturnResult
messageDecoder =
    Json.Decode.map4 Message
        (Json.Decode.field "ts" timestampToDate)
        (Json.Decode.field "author" Json.Decode.string)
        (Json.Decode.field "uid" Json.Decode.string)
        (Json.Decode.field "text" Json.Decode.string)
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (MessageRes val))


--loginDecoder : Decoder ReturnResult
--loginDecoder =
--    Json.Decode.map4 Login
--        (Json.Decode.maybe (Json.Decode.field "username" Json.Decode.string))
--        (Json.Decode.maybe (Json.Decode.field "guid" Json.Decode.string))
--        (Json.Decode.field "status" Json.Decode.string)
--        (Json.Decode.maybe (Json.Decode.field "message" Json.Decode.string))
----        |> Json.Decode.andThen (\val -> Json.Decode.succeed (LoginSuccess val))
--        |> Json.Decode.andThen (\val ->
--            if val.status == "ok" then
--                Json.Decode.succeed (LoginSuccess val)
--            else
--                Json.Decode.succeed (LoginFail val))

successToLogin : LoginResponse -> Login
successToLogin resp =
    let
        user = Maybe.withDefault "" resp.username
        guid = Maybe.withDefault "" resp.guid
    in
        Login user guid

failToLoginError : LoginResponse -> LoginError
failToLoginError resp =
    let
        code = Maybe.withDefault -1 resp.code
        msg = Maybe.withDefault "" resp.message
    in
        LoginError code msg

loginDecoder : Decoder ReturnResult
loginDecoder =
    Json.Decode.map5 LoginResponse
        (Json.Decode.maybe (Json.Decode.field "username" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "guid" Json.Decode.string))
        (Json.Decode.field "status" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "message" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "code" Json.Decode.int))
        |> Json.Decode.andThen (\val ->
            if val.status == "ok" then
                Json.Decode.succeed (LoginSuccess (successToLogin val))
            else
                Json.Decode.succeed (LoginFail (failToLoginError val)))

usersListDecoder : Decoder ReturnResult
usersListDecoder =
    Json.Decode.field "list" (Json.Decode.list Json.Decode.string)
        |> Json.Decode.andThen (\val -> Json.Decode.succeed (UsersListRes val))


decoder : String -> Decoder ReturnResult
decoder type_ =
    case type_ of
        "message" ->
            messageDecoder

        "login" ->
            loginDecoder

        "usersList" ->
            usersListDecoder

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

--main : Html msg
--main =
--    div []
--        [ text (resultToString (parseMessage "{\"type\": \"message\",  \"ts\": \"1518165045444\", \"text\": \"Hello!\"}"))
--        , br [] []
--        , text (resultToString (parseMessage "{\"type\": \"message\", \"ts\": 1518165045444, \"text\": \"Hello!\"}"))
--        , br [] []
--        , text (resultToString (parseMessage "{\"type\": \"login\", \"ts\": 1518165045444, \"text\": \"Hello!\", \"user\": \"timan\"}"))
--        ]
