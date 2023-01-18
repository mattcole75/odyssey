export const whatIsTheErrorMessage = (err) => {

    let errorMessage = null;

    if(err.response) {

        switch (err.response.status) {
            case 400:
                errorMessage = '400: Server request error. If this problem continues, please contact your system administrator.';
                break;
            
            case 401:
                errorMessage = '401: Server request unauthorised. If this problem continues, please contact your system administrator.';
                break;
            
            case 404:
                errorMessage = '404: Server request error - resource not found. If this problem continues, please contact your system administrator.';
                break;

            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email address not found. Check your email address or try creating an account.';
                break;
            
            case 'EMAIL_EXISTS':
                errorMessage = 'Email address already registered.';
                break;
            
            case 'INVALID_PASSWORD':
                errorMessage = 'Incorrect password. Did you forget your password?';
                break;
            
            case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
                errorMessage = 'Too many unsuccessful attempts. Please try again later.';
                break;

            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'There is a problem. Please contact your administrator.';
                break;
            
            case 'USER_DISABLED':
                errorMessage = 'Your account is disabled. Please contact your administrator.';
                break;

            case 'INVALID_ID_TOKEN':
                errorMessage = 'You\'ve been logged out. Please log in again.';
                break;
            
            case 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN':
                errorMessage = 'Your session has expired. Please log in again.';
                break;
            default:
                console.log(err);
                errorMessage = 'Unknown error. Please contact your administrator.'
        }

    } else {
        console.log(err);
        errorMessage = 'Unknown error. Please contact your administrator.';
    }

    return errorMessage;
}