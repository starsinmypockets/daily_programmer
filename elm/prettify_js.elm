module Main exposing (..)

import Html as H
import Debug exposing (log)
import Json.Decode exposing (Decoder, decodeValue, succeed, string)


json =
    """
{"name": "Devin", "age": 38, "hasPets": true, "petNames": ["Joey", "Tuna", "Seven"], "favorites" : {"colors": null, "musicians": ["Bad Religion", "Taylor Swift"]}}
"""


type alias Guy =
    { name : String
    , age : Int
    , hasPets : Bool
    , petNames : List String
    , favorites : Favorites
    }


type alias Favorites =
    { colors : List String
    , musicians : List String
    }


guy =
    Decoder Guy
        |> log "guy"


main =
    H.text "Foo"
