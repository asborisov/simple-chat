module Main exposing (main)

import Time exposing (Posix)
import Browser exposing (sandbox)
import Html exposing (Html, button, div, text, input, label, text)
import Html.Events exposing (onClick, onInput)
import Html.Attributes exposing (class, type_, placeholder, value)

import ChatEvents exposing (onEnter)

main =
  sandbox { init = 0, update = update, view = view }

type alias ChatMessage =
    { timeStamp : Posix
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

type Msg = InputName

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    InputName name ->
        ({ model | username = msg }, Cmd.none)

loginView : Model -> Html Msg
loginView model =
    div [ class "login" ]
        [ input [ type_ "text", placeholder "Enter you login", onInput InputName, onEnter SEND_LOGIN ] []
        , input [ type_ "button", onClick SEND_LOGIN, value "Enter" ] []
        ]

view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
