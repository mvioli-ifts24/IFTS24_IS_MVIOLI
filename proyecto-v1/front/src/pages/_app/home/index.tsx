import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All from "./_tabs/all";
import { useState } from "react";
import Reviewed from "./_tabs/reviewed";

const HomePage = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <Tabs
      defaultValue="reviewed"
      className="max-w-[1080px] flex flex-col gap-4"
    >
      <TabsList className="gap-4 py-8 px-4 max-w-max self-center">
        <Input
          type="string"
          placeholder="Filtrar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex">
          <TabsTrigger value="reviewed">Reseñados</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="reviewed">
        <Reviewed search={search} />
      </TabsContent>
      <TabsContent value="all">
        <All search={search} />
      </TabsContent>
    </Tabs>
  );
};

export default HomePage;
