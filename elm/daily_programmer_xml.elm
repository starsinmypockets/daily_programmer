module DPXMLtoJSON exposing (..)

import Html exposing (text)
import Xml exposing (Value)
import Xml.Encode exposing (null)
import Xml.Decode exposing (decode)
import Xml.Query exposing (tags)
import Json.Encode exposing (encode)
import Debug exposing (log)

decodedXml : Xml.Value
decodedXml = """
<participants>
    <participant>
        <firstName>Michael</firstName> <lastName>Flynn</lastName>
    </participant>
    <participant>
        <firstName>Mika</firstName> <lastName>Lucchini</lastName>
    </participant>
    <participant>
        <firstName>Ryan</firstName> <lastName>McDevitt</lastName>
    </participant>
</participants>
"""
    |> decode
    |> Result.toMaybe
    |> Maybe.withDefault Xml.Encode.null

type alias Participant = {
  firstName: String,
  lastName: String
}

participant : Xml.Value -> Result String Participant
participant value = Result.map2
  (\firstName lastName ->
    {  firstName = firstName
     , lastName = lastName
    }
  )
  (Xml.Query.tag "firstName" Xml.Query.string value)
  (Xml.Query.tag "lastName" Xml.Query.string value)

participantEncoder : Participant -> Json.Encode.Value
participantEncoder p = Json.Encode.object [("first_name",Json.Encode.string p.firstName),("last_name",Json.Encode.string p.lastName)]

participantListEncoder : List Participant -> Json.Encode.Value
participantListEncoder pList = List.map participantEncoder pList |> Json.Encode.list

participants : List Participant
participants =
    tags "participant" decodedXml |> Xml.Query.collect participant

jp = participantListEncoder participants |> encode 2

main =
    Html.text jp
