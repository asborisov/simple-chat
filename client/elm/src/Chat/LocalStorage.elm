module Chat.LocalStorage exposing (chatDataDecoder, getChatData, saveChatData)

import Json.Decode
import Json.Encode
import Ports.LocalStorage


type alias LoginPayload =
    { username : String
    , guid : String
    }


storageField : String
storageField =
    "chatData"


getChatData : Cmd msg
getChatData =
    Ports.LocalStorage.storageGetItem storageField


saveChatData : LoginPayload -> Cmd msg
saveChatData payload =
    [ ( "login", Json.Encode.string payload.username )
    , ( "guid", Json.Encode.string payload.guid )
    ]
        |> Json.Encode.object
        |> (\val -> Ports.LocalStorage.storageSetItem ( storageField, val ))


chatDataDecoder : Json.Decode.Decoder LoginPayload
chatDataDecoder =
    Json.Decode.map2 LoginPayload
        (Json.Decode.field "login" Json.Decode.string)
        (Json.Decode.field "guid" Json.Decode.string)
