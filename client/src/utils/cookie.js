export const getCookie = (name) => {
    const value = ";" + document.cookie;
    const parts = value.split(`;${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
};

export const setCookie = (name, value, exp = 24) => {
    const date = new Date();
    // exp 시간 동안 쿠키 유지
    date.setTime(date.getTime() + exp * 60 * 60 * 1000);

    document.cookie = `${name}= ${value}; expires= ${date.toUTCString()}`;
};

export const deleteCookie = (name) => {
    const date = new Date("2020-01-01").toUTCString();

    document.cookie = name + "=; expires=" + date;
};
