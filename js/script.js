import { FONT_PROPERTIES as FONT, HOURS_IN_MERIDIEM, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from "./constants.js";

// Clock Text
const hoursText = document.querySelector(".hours__text");
const minutesText = document.querySelector(".minutes__text");
const secondsText = document.querySelector(".seconds__text");
const meridiemText = document.querySelector(".meridiem__text");

// Font Variation Settings Text
const hoursFvaWeight = document.querySelector(".hours [data-font-variation-axis=weight]");
const hoursFvaWidth = document.querySelector(".hours [data-font-variation-axis=width]");
const minutesFvaWeight = document.querySelector(".minutes [data-font-variation-axis=weight]");
const minutesFvaWidth = document.querySelector(".minutes [data-font-variation-axis=width]");
const secondsFvaWeight = document.querySelector(".seconds [data-font-variation-axis=weight]");
const secondsFvaWidth = document.querySelector(".seconds [data-font-variation-axis=width]");
const meridiemFvaWeight = document.querySelector(".meridiem [data-font-variation-axis=weight]");
const meridiemFvaWidth = document.querySelector(".meridiem [data-font-variation-axis=width]");

// Progress Indicators
const hoursProgress = document.querySelector(".hours__progress");
const minutesProgress = document.querySelector(".minutes__progress");
const secondsProgress = document.querySelector(".seconds__progress");
const meridiemProgress = document.querySelector(".meridiem__progress");

const addLeadingZero = (string) => (string.length === 1 ? "0" + string : string);

const getTimeData = () => {
	const date = new Date();
	const timeString = date.toLocaleTimeString();
	const [time, meridiem] = timeString.split(" ");
	const [hours, minutes, seconds] = time.split(":");

	let secondsRatio = Number(seconds) / SECONDS_IN_MINUTE;
	let minutesRatio = (Number(minutes) + secondsRatio) / MINUTES_IN_HOUR;
	let hoursRatio = (Number(hours) + minutesRatio) / HOURS_IN_MERIDIEM;
	let meridiemRatio = hoursRatio;

	secondsRatio = parseFloat(secondsRatio.toFixed(2));
	minutesRatio = parseFloat(minutesRatio.toFixed(2));
	hoursRatio = parseFloat(hoursRatio.toFixed(2));
	meridiemRatio = parseFloat(meridiemRatio.toFixed(2));

	return {
		clockDisplay: {
			hours: addLeadingZero(hours),
			minutes: addLeadingZero(minutes),
			seconds: addLeadingZero(seconds),
			meridiem,
		},
		ratios: { secondsRatio, minutesRatio, hoursRatio, meridiemRatio },
	};
};

// https://gomakethings.com/how-to-round-to-the-nearest-number-with-vanilla-js/
const roundWithPrecision = (number, precision) => {
	const rounded = Math.round(parseFloat(number) / precision) * precision;
	return rounded;
};

const getNewPropertyValue = (ratio, key) => {
	const numberToRound = parseFloat(ratio.toFixed(2)) * FONT[key].TOTAL_STEPS * FONT[key].STEP;
	const roundedSteps = roundWithPrecision(numberToRound, FONT[key].STEP);
	return parseInt(roundedSteps, 10) + FONT[key].MIN;
};

const updateTime = () => {
	const {
		clockDisplay: { hours, minutes, seconds, meridiem },
		ratios: { secondsRatio, minutesRatio, hoursRatio, meridiemRatio },
	} = getTimeData();

	const fontWeight = {
		hours: getNewPropertyValue(hoursRatio, "WEIGHT", "hours"),
		minutes: getNewPropertyValue(minutesRatio, "WEIGHT", "minutes"),
		seconds: getNewPropertyValue(secondsRatio, "WEIGHT", "seconds"),
		meridiem: getNewPropertyValue(meridiemRatio, "WEIGHT", "meridiem"),
	};

	const fontWidth = {
		hours: getNewPropertyValue(hoursRatio, "WIDTH", "hours"),
		minutes: getNewPropertyValue(minutesRatio, "WIDTH", "minutes"),
		seconds: getNewPropertyValue(secondsRatio, "WIDTH", "seconds"),
		meridiem: getNewPropertyValue(meridiemRatio, "WIDTH", "meridiem"),
	};

	// Set variable font styles
	hoursText.style.setProperty("--font-variation", `'wght' ${fontWeight.hours}, 'wdth' ${fontWidth.hours}`);
	minutesText.style.setProperty("--font-variation", `'wght' ${fontWeight.minutes}, 'wdth' ${fontWidth.minutes}`);
	secondsText.style.setProperty("--font-variation", `'wght' ${fontWeight.seconds}, 'wdth' ${fontWidth.seconds}`);
	meridiemText.style.setProperty("--font-variation", `'wght' ${fontWeight.meridiem}, 'wdth' ${fontWidth.meridiem}`);

	// Set meta text
	hoursFvaWeight.innerText = fontWeight.hours;
	hoursFvaWidth.innerText = fontWidth.hours;
	minutesFvaWeight.innerText = fontWeight.minutes;
	minutesFvaWidth.innerText = fontWidth.minutes;
	secondsFvaWeight.innerText = fontWeight.seconds;
	secondsFvaWidth.innerText = fontWidth.seconds;
	meridiemFvaWeight.innerText = fontWeight.meridiem;
	meridiemFvaWidth.innerText = fontWidth.meridiem;

	// Set Progress Widths
	secondsProgress.style.setProperty("--scaleX", secondsRatio * 100 + "%");
	minutesProgress.style.setProperty("--scaleX", minutesRatio * 100 + "%");
	hoursProgress.style.setProperty("--scaleX", hoursRatio * 100 + "%");
	meridiemProgress.style.setProperty("--scaleX", meridiemRatio * 100 + "%");

	// Set Clock Text
	hoursText.innerText = hours.length === 1 ? "0" + hours : hours;
	minutesText.innerText = minutes;
	secondsText.innerText = seconds;
	meridiemText.innerText = meridiem;
};

updateTime();

setInterval(() => updateTime(), 1000);
