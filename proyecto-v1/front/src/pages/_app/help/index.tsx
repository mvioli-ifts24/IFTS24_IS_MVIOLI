import { useEffect } from "react";
import Form from "./form";
import useFetcher from "@/hooks/useFetcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReviewCardSkeleton from "@/components/reviewcard/skeleton";
import { CONTACT_MESSAGES_INDEX } from "@/types/contact_messages_endpoint";
import { CircleCheck, CircleDashed } from "lucide-react";

const HelpPage = () => {
  const {
    fetch: fetchMessages,
    loading: loadingMessages,
    data: dataMessages,
  } = useFetcher<CONTACT_MESSAGES_INDEX[]>("contact_messages", "GET");

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="w-full max-w-[1080px] flex flex-col gap-8">
      <Form on_success={() => fetchMessages()} />
      <div>
        <p className="font-bold">Tus preguntas</p>
        {loadingMessages && <ReviewCardSkeleton />}
        <Accordion type="single" collapsible>
          {!loadingMessages &&
            dataMessages?.map((message) => (
              <AccordionItem key={message.id} value={`${message.id}`}>
                <AccordionTrigger className="truncate gap-4">
                  <div className="flex gap-4 justify-between truncate w-full">
                    <div className="flex gap-4 truncate">
                      {message.response ? (
                        <CircleCheck className="text-green-600 min-w-fit" />
                      ) : (
                        <CircleDashed className="text-red-600 min-w-fit" />
                      )}
                      <p className="truncate">{message.message}</p>
                    </div>
                    <p>
                      {new Date(message.created_at).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-2">
                    <b>P:</b>
                    {message.message}
                  </div>
                  <div className="flex gap-2">
                    <b>R:</b>
                    {message.response ??
                      "Tu pregunta pronto sera respondida por un administrador."}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HelpPage;
