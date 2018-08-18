module Main exposing (..)

import Debug exposing (log)


findMin list =
    List.map toString list
        |> List.sort
        |> log "ll"
        |> List.foldr (++) ""
        |> String.toInt
        |> log "min"


findMax list =
    List.map toString list
        |> log "list"
        |> List.foldl (++) ""
        |> String.toInt
        |> log "max"


debug =
    ( findMin [ 79, 82, 34, 83, 69 ], findMax [ 79, 82, 34, 83, 69 ] )
        |> log "debug"


debug2 =
    ( findMin [ 420, 34, 19, 71, 341 ], findMax [ 420, 34, 19, 71, 341 ] )
        |> log "debug2"
