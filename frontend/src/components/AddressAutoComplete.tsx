"use client"

import { ChangeEvent } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

interface AddressAutoCompleteProps {
  onSelect: (result: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

const AddressAutoComplete = ({ onSelect }: AddressAutoCompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initAddressAutocomplete",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 100,
  });

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: google.maps.places.AutocompletePrediction) =>
    () => {
      setValue(description, false);
      clearSuggestions();

      getGeocode({ address: description }).then((results: google.maps.GeocoderResult[]) => {
        const { lat, lng } = getLatLng(results[0]);
        // Return the selected value through the callback prop
        onSelect({
          address: description,
          lat,
          lng
        });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion: google.maps.places.AutocompletePrediction) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="cursor-pointer hover:bg-gray-100 p-2"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref} className="relative text-black">
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
        className="w-full p-2 border rounded"
      />
      {status === "OK" && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

export default AddressAutoComplete;