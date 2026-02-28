export class Async {
    static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async until(check: () => boolean, timeoutMs: number = 10000, frequencyMs: number = 100): Promise<void> {
        let timePassed = 0;
        while (!check() && timePassed < timeoutMs) {
            await Async.delay(frequencyMs);
            timePassed += frequencyMs;

            if (timePassed >= timeoutMs)
                throw new Error('Timeout while waiting for condition');
        }
    }
}