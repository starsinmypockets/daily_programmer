module Main exposing (..)

import Html as H exposing (h1, h2, div, ul, span)
import Html.Attributes exposing (..)
import Debug exposing (log)
import Array


-- CONSTANTS


rows =
    Array.fromList <| List.range 0 9


cols =
    Array.fromList <| List.range 0 9


title =
    "Elm Battle"


unk =
    "○"


hit =
    "*"


miss =
    "-"



-- TYPES


type alias Point =
    { x : Int
    , y : Int
    }


type alias Boat =
    { name : String
    , symb : String
    , length : Int
    }


type Fleet
    = List Boat



-- API


initBoard =
    Array.map (\a -> Array.map (\b -> unk) rows) cols


placeBoat =
    ""


placeFleet =
    ""



-- UI


board classes grid name =
    div classes
        [ h2 [] name
        , div [ class "board-inner" ]
            (List.map
                (\row ->
                    div [ class "board-row" ]
                        (List.map (\val -> span [ class "cell" ] [ H.text val ]) (Array.toList row))
                )
                (Array.toList grid)
            )
        ]


main =
    div [ class "container" ]
        [ h1 []
            [ H.text title ]
        , board [ class "your-board" ] initBoard ([ H.text "Your Board" ])
        , board [ class "opponent-board" ] initBoard ([ H.text "Opponent's Board" ])
        , board [ class "debug-board" ] initBoard ([ H.text "Debug Opponent Board" ])
        ]
