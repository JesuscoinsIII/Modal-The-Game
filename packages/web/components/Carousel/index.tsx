import { Box, useBreakpointValue, useMediaQuery, useTheme } from '@metafam/ds';
import React, { useEffect, useMemo, useState } from 'react';

import { CarouselContext } from './CarouselContext';
import { Item } from './Item';
import { Slider } from './Slider';
import { Track } from './Track';

/**
 * `Carousel` - default / no props will give you a carousel like you see in a Quest or Playbook. To change how it displays & functions (eg: the new [paths & playbooks](http://localhost:3000/paths-and-playbooks)), use the props listed:
 * @prop `gap`: gives you the spacing between items.
 * @prop `defaultCarousel`: false - if true, this unsets the width of the track items so they hug the contents
 * @prop `hidePositions`: false - true will hide the pagination
 * @prop `hideNav`: true - set to false if you want prev/next navigation
 */
export const Carousel: React.FC<{
  gap: number;
  hidePositions?: boolean;
  hideNav?: boolean;
  itemsToShow?: number;
  defaultCarousel?: boolean;
  children: JSX.Element[];
}> = ({
  children,
  gap,
  hideNav = true,
  hidePositions = false,
  itemsToShow = 4,
  defaultCarousel = true,
}) => {
  const [trackIsActive, setTrackIsActive] = useState(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [multiplier, setMultiplier] = useState(0.35);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [constraint, setConstraint] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const positions: number[] = useMemo(
    () => children.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [children, itemWidth, gap],
  );

  const { breakpoints } = useTheme();

  const [isBetweenBaseAndLg] = useMediaQuery(
    `(min-width: ${breakpoints.base}) and (max-width: ${breakpoints.lg})`,
  );

  const [isGreaterThanLg] = useMediaQuery(`(min-width: ${breakpoints.lg})`);

  const isGreaterThanBase = useBreakpointValue({ base: true, md: false });

  const isGreaterThanMd = useBreakpointValue({ base: false, md: true });

  const isGreaterThanXl = useBreakpointValue({ base: false, xl: true });

  const isGreaterThan2Xl = useBreakpointValue({ base: false, '2xl': true });

  useEffect(() => {
    if (isBetweenBaseAndLg) {
      setItemWidth(sliderWidth - gap);
      setMultiplier(0.65);
      setConstraint(1);
    }
    if (isGreaterThanLg) {
      setItemWidth(sliderWidth / 2 - gap);
      setMultiplier(0.5);
      setConstraint(2);
    }

    if (!defaultCarousel && isGreaterThanBase) {
      setItemWidth(114);
      setConstraint(1);
    }
    if (!defaultCarousel && isGreaterThanMd) {
      setItemWidth(158);
      setConstraint(1);
    }
    if (!defaultCarousel && isGreaterThanXl) {
      setItemWidth(270);
      setConstraint(1);
    }

    if (!defaultCarousel && isGreaterThan2Xl) {
      setItemWidth(344);
      setConstraint(2);
    }
  }, [
    isBetweenBaseAndLg,
    isGreaterThanLg,
    sliderWidth,
    gap,
    itemsToShow,
    defaultCarousel,
    isGreaterThanBase,
    isGreaterThanMd,
    isGreaterThanXl,
    isGreaterThan2Xl,
  ]);

  return (
    <CarouselContext.Provider
      value={{
        trackIsActive,
        setTrackIsActive,
        activeItem,
        isSubmittingProof,
        setIsSubmittingProof,
        setActiveItem,
        isDragging,
        setDragging,
        sliderWidth,
        setSliderWidth,
        constraint,
        multiplier,
        itemWidth,
        positions,
        gap,
        hidePositions,
        hideNav,
        itemsToShow,
        defaultCarousel,
      }}
    >
      <CarouselInner shrinkItems={!defaultCarousel}>{children}</CarouselInner>
    </CarouselContext.Provider>
  );
};

const CarouselInner: React.FC<{
  shrinkItems?: boolean;
  children: JSX.Element[];
}> = ({ shrinkItems, children }) => (
  <Slider>
    <Track>
      {children
        .concat(<Box w={shrinkItems ? 'unset' : '100%'} />)
        .map((child, index) => (
          <Item index={index} key={index}>
            {child}
          </Item>
        ))}
    </Track>
  </Slider>
);
