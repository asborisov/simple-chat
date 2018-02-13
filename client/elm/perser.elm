module ParseResponse exposing (parseResponseType)

import Json.Decode exposing (..)
import Date exposing (Date, fromString)
import Result exposing (andThen)

type alias Message =
  {
    timeStamp: String, --Date,
    author: String,
    uid: String,
    text: String
  }

type ReturnResult =
  Message

type ResponseType =
  LOGIN |
  MESSAGE |
  USERS_LIST

type Error =
  ERROR_PARSE |
  UNKNOWN_TYPE

parseMessage : String -> Message
parseMessage value =
  Message "" "" "" ""

parseResponseType : String -> Result Error ResponseType
parseResponseType response =
  let
    msgType = Json.Decode.decodeString (Json.Decode.field "type" Json.Decode.string) response
  in
    case msgType of
      Err err -> Err ERROR_PARSE
      Ok result ->
        case result of
          "login" -> Ok LOGIN
          "message" -> Ok MESSAGE
          "usersList" -> Ok USERS_LIST
          _ -> Err UNKNOWN_TYPE

parseResponseBody : ResponseType -> String -> ReturnResult
parseResponseBody type_ response =
  case type_ of
    MESSAGE -> parseMessage response

parseResponse : String -> ReturnResult
parseResponse response =
  parseResponseType response
    |> andThen