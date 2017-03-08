# YORIMICHI
HAL Event Week 2017

**request**

```json
{
  "departureName": "京都駅",
  "destinationName": "金閣寺"
}
```

**response**

```json
{
  "travelMode": "walking",
  "departurePosition": {
    "lat": "12.12",
    "lng": "135.55",
    "placeName": "京都駅",
    "image": "http://~~"
  },
  "destinationPosition": {
    "lat": "12.12",
    "lng": "135.55",
    "placeName": "金閣寺",
    "image": "http://~~"
  },
  "distance": 2001,
  "localShops": [
    {
      "id": "1",
      "lat": "12.12",
      "lng": "135.555",
      "placeName": "お茶",
      "genre": "仏教寺院",
      "image": "http://~~",
      "businessHours": {
        "startTime": "9:00",
        "endTime": "17:00"
      }
    }
  ]
}
```
