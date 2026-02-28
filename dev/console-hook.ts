export class ConsoleHook {
    private static commands: { [key: string]: Function } = {};

    static initialize() {
        if (!(window as any).r)
            (window as any).r = ConsoleHook.run.bind(ConsoleHook);
    }

    static register(commandName: string, method: Function) {
        ConsoleHook.initialize();
        ConsoleHook.commands[commandName] = method;
    }

    static run(input: string, ...additionalParams: any[]) {
        const [commandName, ...params] = input.split(' ');
        const command = ConsoleHook.commands[commandName];

        if (command) {
            return command(...params, ...additionalParams);
        }
        else {
            console.error(`Custom command "${commandName}" not found.`);
        }
    }
}