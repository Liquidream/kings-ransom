export interface Serialization<T> {
    deserialize(input: Object): T;
    serialize(): string;
}
