export default interface FacebookUser {
    id:string,
    username?: string,
    displayName: string,
    name: {
      familyName?: string,
      givenName?: string,
      middleName?: undefined
    },
    gender?:string,
    profileUrl?:string,
    emails?:Array<{
        value: string
    }>,
    photos?:Array<{
        value: string
    }>,
    provider: string,
    _raw : string
    _json: {
      id: string,
      name?: string,
      last_name?: string,
      first_name?: string,
      picture?: { data: [Object] },
      email?: string
}
}