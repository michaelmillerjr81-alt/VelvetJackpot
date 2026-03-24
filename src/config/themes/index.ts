import { velvetTheme  } from './velvet.theme.ts';
import { pharaohTheme } from './pharaoh.theme.ts';
import { dragonTheme  } from './dragon.theme.ts';
import { neonTheme    } from './neon.theme.ts';
import { pirateTheme  } from './pirate.theme.ts';
import type { ThemeDefinition } from '../../types/index.ts';

export const ThemeRegistry: Record<string, ThemeDefinition> = {
  velvet:  velvetTheme,
  pharaoh: pharaohTheme,
  dragon:  dragonTheme,
  neon:    neonTheme,
  pirate:  pirateTheme,
};

export type ThemeId = keyof typeof ThemeRegistry;

export {
  velvetTheme,
  pharaohTheme,
  dragonTheme,
  neonTheme,
  pirateTheme,
};
