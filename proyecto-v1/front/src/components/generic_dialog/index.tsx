import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const GenericDialog = ({
  title,
  text,
  open,
  set_open,
  children,
}: {
  open: boolean;
  set_open: (open: boolean) => void;
  title: string;
  text: string;
} & PropsWithChildren) => {
  return (
    <Dialog open={open} onOpenChange={set_open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{text}</DialogDescription>
        <DialogFooter>{children}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenericDialog;
