export interface Serialization<T> {
    
    // Populate self from a deserialised JSON Object
    fromJSON(input: any): T;
    
    // This is actually the built-in function that JSON.stringify will use.
    // So, this allows clases to override this (e.g. to hide props)
    toJSON(): any;
}
