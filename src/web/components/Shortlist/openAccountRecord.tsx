import type { ShortlistEntry } from "@api-types";
import { openModal } from "../ModalManager";
import AccountRecordModal, { type AccountRecordPerson } from "./AccountRecordModal";

export default function openAccountRecord(entry: ShortlistEntry, person: AccountRecordPerson) {
  openModal((close) => <AccountRecordModal entry={entry} person={person} onClose={close} />);
}
