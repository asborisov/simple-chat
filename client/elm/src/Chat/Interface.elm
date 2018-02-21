module Chat.Interface exposing (message)

import Date
import Html exposing (Html, button, div, input, label, text)
import Html.Attributes exposing (placeholder, style, type_, value)
import Html.Events exposing (onClick, onInput)


type alias ChatMessage =
    { timeStamp : Date.Date
    , text : String
    , author : String
    }

messageStyle =
    [ ("margin", "0.15em 0") ]

messageAuthorStyle =
    [ ("color", "dimgray") ]

messageTextStyle =
    []

monthToNumber : Date.Month -> String
monthToNumber month =
    case month of
        Date.Jan -> "01"
        Date.Feb -> "02"
        Date.Mar -> "03"
        Date.Apr -> "04"
        Date.May -> "05"
        Date.Jun -> "06"
        Date.Jul -> "07"
        Date.Aug -> "08"
        Date.Sep -> "09"
        Date.Oct -> "10"
        Date.Nov -> "11"
        Date.Dec -> "12"


formatDate : Date.Date -> String
formatDate date =
    (toString (Date.day date)) ++ "." ++ (monthToNumber (Date.month date))
    ++ "." ++ (toString (Date.year date)) ++ " "
    ++ (toString (Date.hour date)) ++ ":" ++ (toString (Date.minute date))
    ++ ":" ++ (toString (Date.second date))


message : ChatMessage -> Html a
message msg =
    let
        textElement =
            label [ style messageTextStyle ] [ text msg.text ]

        children =
            if String.isEmpty msg.author then
                [ textElement ]
            else
                [ label [ style messageAuthorStyle ] [ text (msg.author ++ "[" ++ (formatDate msg.timeStamp) ++ "]: ")], textElement ]
    in
        div [ style messageStyle ] children
