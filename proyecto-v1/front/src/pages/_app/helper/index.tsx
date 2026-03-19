import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import Form from "./form";
const HelperPage = () => {
  const navigate = useNavigate();

  const {
    fetch: fetchMessages,
    loading: loadingMessages,
    data: dataMessages,
  } = useFetcher<CONTACT_MESSAGES_INDEX[]>("admin/contact_messages", "GET");

  useEffect(() => {
    if (!getAuth().data?.is_admin) {
      navigate("/home");
    }
    fetchMessages();
  }, []);

  const [search, setSearch] = useState<string>("");

  return (
    <div className="w-full max-w-[1080px] flex flex-col gap-8">
      <Input
        className="self-end w-auto"
        type="string"
        placeholder="Filtrar por email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-4">
        <p className="font-bold">Preguntas pendientes</p>
        {loadingMessages && <ReviewCardSkeleton />}
        <Accordion type="single" collapsible>
          {!loadingMessages &&
            dataMessages
              ?.filter((message) => !message.response)
              .filter((message) => message.user_email.includes(search))
              .map((message) => (
                <AccordionItem key={message.id} value={`${message.id}`}>
                  <AccordionTrigger className="truncate gap-4">
                    <div className="flex gap-4 justify-between truncate w-full">
                      <div className="flex gap-4 truncate">
                        <CircleDashed className="text-red-600 min-w-fit" />
                        <p className="truncate">{message.message}</p>
                      </div>
                      <p>
                        {new Date(message.created_at).toLocaleDateString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <Link to={`/profile/${message.user_id}`}>
                        <p className="italic text-right">
                          {message.user_email}
                        </p>
                      </Link>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <b>P:</b>
                          {message.message}
                        </div>
                        <Form
                          contact_message_id={message.id}
                          on_success={() => fetchMessages()}
                          key={message.id}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
        </Accordion>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-bold">Preguntas contestadas</p>
        {loadingMessages && <ReviewCardSkeleton />}
        <Accordion type="single" collapsible>
          {!loadingMessages &&
            dataMessages
              ?.filter((message) => message.response)
              .filter((message) => message.user_email.includes(search))
              .map((message) => (
                <AccordionItem key={message.id} value={`${message.id}`}>
                  <AccordionTrigger className="truncate gap-4">
                    <div className="flex gap-4 justify-between truncate w-full">
                      <div className="flex gap-4 truncate">
                        <CircleCheck className="text-green-600 min-w-fit" />
                        <p className="truncate">{message.message}</p>
                      </div>
                      <p>
                        {new Date(message.created_at).toLocaleDateString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <Link to={`/profile/${message.user_id}`}>
                        <p className="italic text-right">
                          {message.user_email}
                        </p>
                      </Link>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <b>P:</b>
                          {message.message}
                        </div>
                        <div className="flex gap-2">
                          <b>R:</b>
                          {message.response}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HelperPage;
