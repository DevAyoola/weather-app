"use strict";

class Weatherdata {
	constructor(datetime, conditions, temp, humidity, description) {
		this.datetime = datetime;
		this.conditions = conditions;
		this.temp = temp;
		this.humidity = humidity;
		this.description = description;
	}
}

class Today extends Weatherdata {
	value = 0;

	constructor(datetime, conditions, temp, humidity, description) {
		super(datetime, conditions, temp, humidity, description);
	}
}

class Tomorrow extends Weatherdata {
	value = 1;

	constructor(datetime, conditions, temp, humidity, description) {
		super(datetime, conditions, temp, humidity, description);
	}
}

const cardHeader = document.querySelector(".card-header");
const accordionGet = document.querySelector("#accordionGet");
const accordionDisplay = document.querySelector("#accordionDisplay");
const btnGoBack = document.querySelector(".btn-goback");
const btnLocation = document.querySelector(".location .accordion-body button");
const inputCity = document.querySelector(".city .accordion-body input");
const todayData = accordionDisplay.querySelector(".today .accordion-body");
const tomorrowData = accordionDisplay.querySelector(
	".tomorrow .accordion-body"
);

class App {
	#url;

	constructor() {
		// Event handlers
		btnLocation.addEventListener("click", () => {
			this._getLocation();
			accordionGet.style.display = "none";
			accordionDisplay.style.display = "block";
			btnGoBack.classList.toggle("d-none");
		});

		btnGoBack.addEventListener("click", () => {
			inputCity.value = "";
			document.location.reload();
			accordionGet.style.display = "block";
			accordionDisplay.style.display = "none";
			btnGoBack.classList.toggle("d-none");
		});

		inputCity.addEventListener("keyup", (e) => {
			const city = inputCity.value;
			if (e.key == "Enter" && inputCity.value != "") {
				this._loadCityInfo(city);
				accordionGet.style.display = "none";
				accordionDisplay.style.display = "block";
				btnGoBack.classList.toggle("d-none");
			}
		});
	}

	_getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this._loadLocationInfo.bind(this),
				function () {
					alert("Could not get your location");
				}
			);
		}
	}

	_loadLocationInfo(position) {
		const [latitude, longitude] = [
			position.coords.latitude,
			position.coords.longitude,
		];

		this.#url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=JHSJJW4VY2T4BT6VHJVCN8GRR&contentType=json`;

		this._fetchApi(this.#url);
	}

	_loadCityInfo(city) {
		this.#url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=JHSJJW4VY2T4BT6VHJVCN8GRR&contentType=json`;

		this._fetchApi(this.#url);
	}

	_fetchApi(url) {
		const errorMsg = "City not found";

		fetch(url, {
			method: "GET",
			headers: {},
		})
			.then((response) => {
				if (!response.ok) {
					alert(errorMsg);
					todayData.innerHTML = `
						<span class="fs-3 py-2 fw-semibold">City not found!</span>`;
					tomorrowData.innerHTML = `
						<span class="fs-3 py-2 fw-semibold">City not found!</span>`;
					inputCity.value = "";
				}
				return response.json();
			})
			.then((data) => {
				this._getWeatherData(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	_getWeatherData(data) {
		let val, datetime, conditions, temp, humidity, description;
		let data1, data2;

		(function (val = 0) {
			datetime = data.days[val].datetime;
			conditions = data.days[val].icon;
			temp = data.days[val].temp;
			humidity = data.days[val].humidity;
			description = data.days[val].description;
			console.log(datetime, conditions, temp, humidity, description);

			data1 = new Today(datetime, conditions, temp, humidity, description);
		})();

		(function (val = 1) {
			datetime = data.days[val].datetime;
			conditions = data.days[val].icon;
			temp = data.days[val].temp;
			humidity = data.days[val].humidity;
			description = data.days[val].description;
			console.log(datetime, conditions, temp, humidity, description);

			data2 = new Tomorrow(datetime, conditions, temp, humidity, description);
		})();

		this._displayResult(data1, data2);
	}

	_displayResult(data1, data2) {
		const d1 = new Date(data1.datetime);
		const d2 = new Date(data2.datetime);
		let src;
		console.log(d1);

		if (data1.conditions === "snow" || data2.conditions === "snow")
			src = "icons/snow.svg";

		if (data1.conditions === "storm" || data2.conditions === "storm")
			src = "icons/storm.svg";

		if (data1.conditions === "rain" || data2.conditions === "rain")
			src = "icons/rain.svg";

		if (
			data1.conditions === "fog" ||
			data2.conditions === "fog" ||
			data1.conditions === "wind" ||
			data2.conditions === "wind"
		)
			src = "icons/haze.svg";

		if (
			data1.conditions === "cloudy" ||
			data2.conditions === "cloudy" ||
			data1.conditions === "partly-cloudy-day" ||
			data2.conditions === "partly-cloudy-day" ||
			data1.conditions === "partly-cloudy-night" ||
			data2.conditions === "partly-cloudy-night"
		)
			src = "icons/cloud.svg";

		if (
			data1.conditions === "clear-day" ||
			data2.conditions === "clear-day" ||
			data1.conditions === "clear-night" ||
			data2.conditions === "clear-night"
		)
			src = "icons/clear.svg";

		todayData.innerHTML = `
			<span class="fw-normal fs-6 pb-2 fw-semibold"
				>${d1.toDateString()}</span>
			<img src="${src}" />
			<span class="fs-1 py-2 fw-semibold">${data1.temp}&#8451;</span>
			<span class="fs-6 pb-1"><span class="fw-semibold">Humidity:</span> ${
				data1.humidity
			}%</span>
			<span class="fs-6 text-center"><span class="fw-semibold">Description:</span> ${
				data1.description
			}</span>`;

		tomorrowData.innerHTML = `
			<span class="fw-normal fs-6 pb-2 fw-semibold"
				>${d2.toDateString()}</span
			>
			<img src="${src}" />
			<span class="fs-1 py-2 fw-semibold">${data2.temp}&#8451;</span>
			<span class="fs-6 pb-1"><span class="fw-semibold">Humidity:</span> ${
				data2.humidity
			}%</span>
			<span class="fs-6 text-center"><span class="fw-semibold">Description:</span> ${
				data2.description
			}</span>`;
	}
}
const app = new App();
