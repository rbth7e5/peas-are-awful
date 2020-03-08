import {MAPBOX_TOKEN} from '../private';

const MAPBOX_HOST = 'https://api.mapbox.com';

export async function getDirections(fromCoords: number[], toCoords: number[]) {
  const url = `${MAPBOX_HOST}/directions/v5/mapbox/driving/
  ${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}
  ?access_token=${MAPBOX_TOKEN}&geometries=geojson`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const {ok, status} = response;
  const json = await response.json();

  if (!ok) {
    const err = new Error(`Error ${status}: ${json.message}`);
    (err as any).status = status;
    throw err;
  } else {
    return json;
  }
}
