import type { Signal } from "@preact/signals";
import { Button, ButtonCls } from "../components/Button.tsx";

interface CounterProps {
    count: Signal<number>;
}

export default function Counter(props: CounterProps) {
    return (
        <div class="flex gap-8 py-6">
            <Button onClick={() => (props.count.value -= 1)}>-1</Button>
            <p class="text-3xl tabular-nums">{props.count}</p>
            <ButtonCls onClick={() => (props.count.value += 1)}>+1</ButtonCls>
        </div>
    );
}
