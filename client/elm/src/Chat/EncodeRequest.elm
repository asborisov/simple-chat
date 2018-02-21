module Chat.EncodeRequest exposing (Payload (..), LoginPayload, encodeRequest)
--import Debug exposing (log)
--import Html exposing (Html)
import Json.Encode exposing (string, Value)

type alias LoginPayload =
    { username : String
    , guid : String
    }

type Payload =
    Login LoginPayload
    | Message String

requestData : Payload -> List (String, Value)
requestData payload =
    case payload of
        Login login ->
            [ ( "type", Json.Encode.string "login" )
            , ( "username", Json.Encode.string login.username )
            , ( "guid", Json.Encode.string login.guid ) ]

        Message msg ->
            [ ("type", Json.Encode.string "message")
            , ("text", Json.Encode.string msg) ]


encodeRequest : Payload -> String
encodeRequest payload =
    payload
        |> requestData
        |> Json.Encode.object
        |> Json.Encode.encode 0

--main = log "test" (encodeRequest (Login (LoginPayload "timan" "123")))