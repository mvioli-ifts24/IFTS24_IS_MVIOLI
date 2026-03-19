import { Skeleton } from "../ui/skeleton";

const GamecardSkeleton = ({ fakeN }: { fakeN: number }) => {
  return (
    <Skeleton
      className={`${
        fakeN % 2 ? "w-[350px]" : "w-[250px]"
      } h-[334px] rounded-lg flex-grow`}
    />
  );
};

export default GamecardSkeleton;
