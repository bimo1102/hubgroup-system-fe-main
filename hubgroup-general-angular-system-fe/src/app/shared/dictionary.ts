export class Dictionary<T> {
    private items: { [index: string]: T } = {};

    private size = 0;

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public count(): number {
        return this.size;
    }

    public add(key: string, value: T) {
        if (this.items.hasOwnProperty(key)) {
            throw new Error('key duplicate');
        }
        this.size++;
        this.items[key] = value;
    }

    public tryAdd(key: string, value: T) {
        if (this.items.hasOwnProperty(key)) {
            return;
        }
        this.size++;
        this.items[key] = value;
    }

    public change(key: string, value: T) {
        if (!this.items.hasOwnProperty(key)) {
            throw new Error('key not found');
        }
        this.items[key] = value;
    }

    public changeOrAdd(key: string, value: T) {
        if (this.containsKey(key)) {
            this.change(key, value);
        } else {
            this.tryAdd(key, value);
        }
    }

    public remove(key: string): T | undefined {
        const val = this.items[key];
        if (val) {
            delete this.items[key];
            this.size--;
            return val;
        }
        return;
    }

    public item(key: string): T {
        return this.items[key];
    }

    public keys(): string[] {
        const keySet: string[] = [];

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public values(): T[] {
        const values: T[] = [];
        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    }
}
