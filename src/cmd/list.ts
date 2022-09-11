import {MY_ACCOUNT} from "../web3/global";
import {Registry} from "../momentum-safe/registry";
import {
  printMyMessage,
  registerState,
  setState,
  State,
  executeCmdOptions, CmdOption
} from "./common";

export function registerList() {
  registerState(State.List, () => list());
}

async function list() {
  console.clear();
  await printMyMessage();

  const msafes = await Registry.getOwnedMomentumSafes(MY_ACCOUNT.address());

  let i = 1;

  const opts: CmdOption[] = [];
  msafes.pendings.forEach( addr => {
    opts.push({
      shortage: i,
      showText: `${addr} (Pending Creation)`,
      handleFunc: () => setState(State.PendingCreate, {address: addr}),
    });
    i += 1;
  });

  msafes.msafes.forEach ( addr => {
    opts.push({
      shortage: i,
      showText: `${addr}`,
      handleFunc: () => setState(State.MSafeDetails, {address: addr}),
    });
    i += 1;
  });

  opts.push(
    {shortage: 'b', showText: 'Back', handleFunc: () => setState(State.Entry)},
    {shortage: 'r', showText: 'Refresh', handleFunc: () => setState(State.List)},
  );

  await executeCmdOptions('My Momentum Safes', opts);
}