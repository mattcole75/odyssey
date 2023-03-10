// import { digestStringAsync, CryptoDigestAlgorithm } from 'expo-crypto';
export const checkValidity = ( value, rules ) => {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isCreditCardExpiry) {
        const pattern = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isEmail) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        /* const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; */
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isCreditCard) {
        const pattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isPhoneNumber) {
        const pattern = /^(?:0|\+?44)(?:\d\s?){9,10}$/;
        isValid = pattern.test(value) && isValid
    }

    if(rules.isUrl) {
        const pattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        isValid = pattern.test(value) && isValid;
    }

    if(rules.isPostcode) {
        const pattern = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
        isValid = pattern.test(value) && isValid;
    }

    return isValid;
};

export const updateMediumDateTimeFormat = (datetime) => {
    let dt = new Date(datetime);
    return dt.toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'});
};
// export const updateLongDateTimeFormat = (datetime) => {
//     let dt = new Date(datetime);
//     return dt.toLocaleString('en-GB', {dateStyle: 'full', timeStyle: 'short'});
// };
export const updateLongDateTimeFormat = (datetime) => {
    let dt = new Date(datetime);
    return dt.toLocaleString('en-GB', {weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
};
export const updateCurrencyFormat = (currency) => {
    let c = parseFloat(currency);
    return c.toLocaleString('en-GB', {style: 'currency', currency: 'GBP'});
};

// export const hashString = (string) => {
//     return crypto.createHash('sha1').update(string).digest('hex');
// };

// export const hashPassword = async (string) => { await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, string) };

// const digest = await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA256,
//     'GitHub stars are neat 🌟'
//   );

// export const hashPassword = (string) => {
//     return crypto.createHash('sha256').update(string).digest('hex');
// };

export const hashPassword = async (string) => {

    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
}

// export const updateObject = (oldObject, updatedProperties) => {
//     return {
//         ...oldObject,
//         ...updatedProperties
//     };
// }

// export const getKeyWords = (phrase) => {
//     return new Promise(resolve => {

//         const removePuncuation = phrase.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
//         const wordArray = removePuncuation.match(/[^\s]+|\s+[^\s+]$/g);

//         const wordArrayLower = wordArray.map(ele => {
//             return ele.toLowerCase();
//         });

//         resolve(wordArrayLower.filter( x => !stopWords.includes(x) ));
    
//     })
// }

// const doSomethingAsync = () => {
//     return new Promise(resolve => {
//       setTimeout(() => resolve('I did something'), 3000)
//     })
// }

export const filterIntelliverseArray = (toBeFilteredArray, referenceArray) => {

    // commented out because if the toBeFiltered Array changes the includes does not find them resulting in an unfiltered array
    // let filtered = toBeFilteredArray.filter((item) => {
    //     return !referenceArray.includes(item);
    // });

    // return filtered;

    let removeElements = [];
    referenceArray.forEach(element => {
        removeElements.push(element.result);
    });

    return toBeFilteredArray.filter(item =>
        removeElements.indexOf(item.result) === -1
    )
};

export const filterArray = (toBeFilteredArray, referenceArray) => {

    let removeElements = [];
    referenceArray.forEach(element => {
        removeElements.push(element.name);
    });

    return toBeFilteredArray.filter(item =>
        removeElements.indexOf(item.name) === -1
    )
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}