module Main exposing (..)

import Html as H
import Json.Decode exposing (..)
import Debug exposing (log)


input1 =
    """
    {
      "name": "Devin",
      "age": 38,
      "hasPets": true
    }
    """


input2 =
    """
    {
      "name": "Devin",
      "age": 38,
      "hasPets": true,
      "petNames": [
          "Joey",
          "Tuna",
          "Seven"
      ]
    }
"""


type Visibility
    = All
    | Active
    | Completed


type alias Task =
    { task : String, completed : Bool }


buy : Task
buy =
    { task = "Buy milk", completed = True }


drink : Task
drink =
    { task = "Drink milk", completed = False }


tasks : List Task
tasks =
    [ buy, drink ]


keep : Visibility -> List Task -> List Task
keep visibility tasks =
    case visibility of
        All ->
            tasks

        Active ->
            List.filter (\t -> t.completed == False) tasks

        Completed ->
            List.filter (\t -> t.completed) tasks


complete : List Task -> List Task
complete tasks =
    keep Active tasks


tasksToStr : List Task -> List String
tasksToStr tasks =
    List.map (\task -> task.task) tasks 

asStr = 
    keep All tasks
    |> tasksToStr
    |> List.foldl (\a b -> " >>> " ++ a ++ " <<< " ++ b) ""

{-
   tasksToStr complete =
       List.foldl (\a b -> a.task ++ b.tasl) tasks
           |> log "folded"

   str =
       tasksToStr complete
           |> log "tasks"

-}


main =
    H.text asStr
    H.ul [] tasksToStr
