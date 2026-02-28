export interface CancellationToken {
    isCancelled(): boolean;

    throwIfCancelled(): void;
}

class CancellationTokenInternal implements CancellationToken {
    private _isCancelled: boolean = false;

    constructor(isCancelled: boolean = false) {
        this._isCancelled = isCancelled;
    }

    /**
     * Gets whether cancellation has been requested
     */
    public isCancelled(): boolean {
        return this._isCancelled;
    }

    /**
     * Throws an error if cancellation has been requested
     */
    public throwIfCancelled(): void {
        if (this._isCancelled) {
            throw new CancellationError('Operation was cancelled');
        }
    }

    /**
     * Internal method to cancel the token
     */
    cancel(): void {
        this._isCancelled = true;
    }

    /**
     * A token that is never cancelled
     */
    public static readonly None: CancellationToken = new CancellationTokenInternal(false);

    /**
     * A token that is already cancelled
     */
    public static readonly Cancelled: CancellationToken = new CancellationTokenInternal(true);
}

/**
 * Error thrown when an operation is cancelled
 */
export class CancellationError extends Error {
    constructor(message: string = 'Operation was cancelled') {
        super(message);
        this.name = 'CancellationError';
    }
}

/**
 * Source for creating and managing cancellation tokens
 */
export class CancellationTokenSource {
    private _token: CancellationTokenInternal = new CancellationTokenInternal();

    /**
     * Gets the token currently associated with this source
     */
    public get token(): CancellationToken {
        return this._token;
    }

    /**
     * Cancels the current token and creates a new one
     */
    public newUnique(timeoutMs: number = -1): CancellationToken {
        this._token.cancel();
        this._token = new CancellationTokenInternal();

        if (timeoutMs != -1)
            setTimeout(() => this._token.cancel(), timeoutMs);

        return this._token;
    }

    /**
     * Cancels the current token
     */
    public cancel(): void {
        this._token.cancel();
    }
}