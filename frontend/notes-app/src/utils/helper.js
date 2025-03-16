export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

export const getInitils = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i=0;i<Math.min(2,words.length);i++){
        initials+=words[i][0];
    }

    return initials.toUpperCase();
}