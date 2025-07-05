---
title: SwayFX
categories: [compositor, window-manager, wayland]
created_at: 2024-03-02
updated_at: 2024-03-02
---

Sway is an incredible window manager, and certainly one of the most well established wayland window managers. However, it is restricted to only include the functionality that existed in i3. This fork ditches the simple wlr_renderer, and replaces it with our fx_renderer, capable of rendering with fancy GLES2 effects. This, along with a couple of minor changes, expands sway's featureset to include the following:

- Blur
- Anti-aliased rounded corners, borders, and titlebars
- Shadows
- Dim unfocused windows
- Scratchpad treated as minimize: Allows docks, or panels with a taskbar, to correctly interpret minimize / unminimize requests (thanks to LCBCrion)
- nixify the repo: Allows nixos users to easily contribute to and test this project


Learn more at their [website](.link).
