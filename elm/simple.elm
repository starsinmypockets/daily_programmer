module Main exposing (..)

import Json.Encode
import Json.Decode exposing (field)
import Html
import Debug exposing (log)


someguy =
    """{"name": "Devin", "age": 38, "hasPets": true, "petNames": ["Joey", "Tuna", "Seven"], "favorites" : {"colors": null, "musicians": ["Bad Religion", "Taylor Swift"]}}"""


type alias Guy =
    { name : String
    , age : Int
    , hasPets : Bool
    , petNames : List String
    , favorites : Favorites
    }


type alias Favorites =
    { colors : Maybe ComplexType
    , musicians : List String
    }


decodeGuy =
    Json.Decode.map5 Guy
        (field "name" Json.Decode.string)
        (field "age" Json.Decode.int)
        (field "hasPets" Json.Decode.bool)
        (field "petNames" Json.Decode.list Json.Decode.string)
        (field "favorites" decodeFavorites)


decodeFavorites =
    Json.Decode.map2 Favorites
        (field "colors" Json.Decode.maybe decodeComplexType)
        (field "musicians" Json.Decode.list Json.Decode.string)


guy =
    decodeGuy guyStr
        |> log "guy"


main =
    H.text guy
