// cdn : <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>

function add_padding(key_str, total_size) {
    if (key_str.length >= total_size)
        return key_str;

    while (key_str.length < 16)
        key_str += '\0';
    return key_str;
}

async function decrypt(url, key) {
    let data;

    await fetch(url)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                data = text;
            })
    console.log(data);

    master_key = add_padding(key)

    // Decode the base64 data so we can separate iv and crypt text.
    var rawData = atob(data);
    // Split by 16 because my IV size
    var iv = rawData.substring(0, 16);
    var crypttext = rawData.substring(16);

    //Parsers
    crypttext = CryptoJS.enc.Latin1.parse(crypttext);
    iv = CryptoJS.enc.Latin1.parse(iv); 
    key = CryptoJS.enc.Utf8.parse(master_key);

    // Decrypt
    var plaintextArray = CryptoJS.AES.decrypt(
      { ciphertext:  crypttext},
      key,
      {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}
    );

    // Can be Utf8 too
    output_plaintext = CryptoJS.enc.Latin1.stringify(plaintextArray);
    return decodeURIComponent(output_plaintext);
}