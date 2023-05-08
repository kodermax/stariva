// @mui
function hexToRgb(color: any) {
  color = color.slice(1);

  const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, 'g');
  let colors = color.match(re);

  if (colors && colors[0].length === 1) {
    colors = colors.map((n: any) => n + n);
  }

  return colors
    ? `rgb${colors.length === 4 ? 'a' : ''}(${colors
      .map((n: any, index: number) => {
        return index < 3 ? parseInt(n, 16) : Math.round((parseInt(n, 16) / 255) * 1000) / 1000;
      })
      .join(', ')})`
    : '';
}

function decomposeColor(color: any) {
  // Idempotent
  if (color.type) {
    return color;
  }

  if (color.charAt(0) === '#') {
    return decomposeColor(hexToRgb(color));
  }

  const marker = color.indexOf('(');
  const type = color.substring(0, marker);

  if (['rgb', 'rgba', 'hsl', 'hsla', 'color'].indexOf(type) === -1) {
    throw new Error(
      'MUI: Unsupported `%s` color.\n' +
      'The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().',
      color,
    );
  }

  let values = color.substring(marker + 1, color.length - 1);
  let colorSpace;

  if (type === 'color') {
    values = values.split(' ');
    colorSpace = values.shift();
    if (values.length === 4 && values[3].charAt(0) === '/') {
      values[3] = values[3].slice(1);
    }
    if (['srgb', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec-2020'].indexOf(colorSpace) === -1) {
      throw new Error(
        'MUI: unsupported `%s` color space.\n' +
        'The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.',
        colorSpace,
      );
    }
  } else {
    values = values.split(',');
  }
  values = values.map((value: any) => parseFloat(value));

  return { type, values, colorSpace };
}

function clamp(value: number, min = 0, max = 1) {
  if (process.env.NODE_ENV !== 'production') {
    if (value < min || value > max) {
      console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
    }
  }

  return Math.min(Math.max(min, value), max);
}
function alpha(color: any, value: any) {
  color = decomposeColor(color);
  value = clamp(value);

  if (color.type === 'rgb' || color.type === 'hsl') {
    color.type += 'a';
  }
  if (color.type === 'color') {
    color.values[3] = `/${value}`;
  } else {
    color.values[3] = value;
  }

  return recomposeColor(color);
}

function recomposeColor(color: any) {
  const { type, colorSpace } = color;
  let { values } = color;

  if (type.indexOf('rgb') !== -1) {
    // Only convert the first 3 values to int (i.e. not alpha)
    values = values.map((n: number, i: number) => (i < 3 ? parseInt(n, 10) : n));
  } else if (type.indexOf('hsl') !== -1) {
    values[1] = `${values[1]}%`;
    values[2] = `${values[2]}%`;
  }
  if (type.indexOf('color') !== -1) {
    values = `${colorSpace} ${values.join(' ')}`;
  } else {
    values = `${values.join(', ')}`;
  }

  return `${type}(${values})`;
}
type BgBlurProps = {
  blur?: number;
  opacity?: number;
  color?: string;
  imgUrl?: string;
};

export function bgBlur(props?: BgBlurProps) {
  const color = props?.color || '#000000';
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    } as const;
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

type BgGradientProps = {
  direction?: string;
  color?: string;
  startColor?: string;
  endColor?: string;
  imgUrl?: string;
};

export function bgGradient(props?: BgGradientProps) {
  const direction = props?.direction || 'to bottom';
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${endColor || color
        }), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

export function textGradient(value: string) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
}

// ----------------------------------------------------------------------

export function filterStyles(value: string) {
  return {
    filter: value,
    WebkitFilter: value,
    MozFilter: value,
  };
}


// ----------------------------------------------------------------------

export const hideScrollbarX = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;
