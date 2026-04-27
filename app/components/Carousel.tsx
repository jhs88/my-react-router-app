import React, { Children, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

type CarouselProps = {
  limit?: number;
  children?: React.ReactNode;
};

/**
 * Generic Carousel Component
 *
 * - Pass content as React children
 *
 * @example
 *   <Carousel limit={3}>
 *     <div>1</div>
 *     <div>2</div>
 *   </Carousel>;
 */
export default function Carousel({ limit = 1, children }: CarouselProps) {
  const totalCount = Children.count(children) ?? 0;
  const pageCount = Math.ceil(totalCount / limit);

  const [page, setPage] = useState(1);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, pageCount));

  const visibleChildren = Children.toArray(children).slice(
    (page - 1) * limit,
    page * limit,
  );

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={page <= 1}
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {visibleChildren.map((child, idx) => (
          <React.Fragment key={idx}>{child}</React.Fragment>
        ))}
      </div>

      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={page >= pageCount || pageCount === 0}
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
