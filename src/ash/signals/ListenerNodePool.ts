import { ListenerNode } from './ListenerNode';

/**
 * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
 * the overhead from object creation and garbage collection.
 */
export class ListenerNodePool<TListener>
{
    private tail:ListenerNode<TListener>;
    private cacheTail:ListenerNode<TListener>;

    public get():ListenerNode<TListener>
    {
        if( this.tail )
        {
            let node:ListenerNode<TListener> = this.tail;
            this.tail = this.tail.previous;
            node.previous = null;
            return node;
        }
        else
        {
            return new ListenerNode<TListener>();
        }
    }

    public dispose( node:ListenerNode<TListener> ):void
    {
        node.listener = null;
        node.once = false;
        node.next = null;
        node.previous = this.tail;
        this.tail = node;
    }

    public cache( node:ListenerNode<TListener> ):void
    {
        node.listener = null;
        node.previous = this.cacheTail;
        this.cacheTail = node;
    }

    public releaseCache():void
    {
        while( this.cacheTail )
        {
            let node:ListenerNode<TListener> = this.cacheTail;
            this.cacheTail = node.previous;
            node.next = null;
            node.previous = this.tail;
            this.tail = node;
        }
    }
}
