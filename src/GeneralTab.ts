// GeneralTab.ts

import { Setting } from "obsidian";
import FileOrganizer from "./index";

export class ModelTab {
  private plugin: FileOrganizer;
  private containerEl: HTMLElement;

  constructor(containerEl: HTMLElement, plugin: FileOrganizer) {
    this.containerEl = containerEl;
    this.plugin = plugin;
  }

  create(): HTMLElement {
    const modelTabContent = this.containerEl.createEl("div", {
      cls: "setting-tab-content",
    });
    // Pro Account Toggle
    const proAccountEl = modelTabContent.createEl("div");
    new Setting(proAccountEl)
      .setName("User Pro Account")
      .setDesc(
        "Enable this to route use your api key from File Organizer 2000."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.usePro).onChange(async (value) => {
          this.plugin.settings.usePro = value;
          this.plugin.settings.usePro = value;
          await this.plugin.saveSettings();
          this.updateSettingsVisibility();
        })
      );
    // File Organizer Settings Section
    const fileOrganizerSettingsEl = modelTabContent.createEl("div", {
      cls: "file-organizer-settings",
    });
    new Setting(fileOrganizerSettingsEl)
      .setName("File Organizer API Key")
      .addText((text) =>
        text
          .setPlaceholder("Enter your File Organizer API Key")
          .setValue(this.plugin.settings.API_KEY)
          .onChange(async (value) => {
            this.plugin.settings.API_KEY = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(fileOrganizerSettingsEl)
      .setName("Custom Server URL")
      .addText((text) =>
        text
          .setPlaceholder("Enter your custom server URL")
          .setValue(this.plugin.settings.customServerUrl)
          .onChange(async (value) => {
            this.plugin.settings.customServerUrl = value;
            await this.plugin.saveSettings();
          })
      );

    const loginButton = fileOrganizerSettingsEl.createEl("button", {
      text: "Login to File Organizer",
    });
    loginButton.addEventListener("click", () => {
      window.open("https://app.fileorganizer2000.com", "_blank");
    });

    // Special message for File Organizer
    const fileOrganizerMessageEl = fileOrganizerSettingsEl.createEl("div", {
      cls: "file-organizer-message",
    });
    fileOrganizerMessageEl
      .createEl("p", {
        text: "Access your dashboard at ",
      })
      .createEl("a", {
        href: "https://app.fileorganizer2000.com",
        text: "File Organizer Dashboard",
        target: "_blank",
      });

    // OpenAI Settings Section
    const openAISettingsEl = modelTabContent.createEl("div", {
      cls: "openai-settings",
    });
    new Setting(openAISettingsEl).setName("OpenAI API Key").addText((text) =>
      text
        .setPlaceholder("Enter your OpenAI API Key")
        .setValue(this.plugin.settings.openAIApiKey)
        .onChange(async (value) => {
          this.plugin.settings.openAIApiKey = value;
          await this.plugin.saveSettings();
          this.plugin.updateOpenAIConfig();
        })
    );

    new Setting(openAISettingsEl).setName("OpenAI Model").addText((text) =>
      text
        .setPlaceholder("Enter the OpenAI model name")
        .setValue(this.plugin.settings.openAIModel)
        .onChange(async (value) => {
          this.plugin.settings.openAIModel = value;
          await this.plugin.saveSettings();
          this.plugin.updateOpenAIConfig();
        })
    );

    new Setting(openAISettingsEl).setName("OpenAI Base URL").addText((text) =>
      text
        .setPlaceholder("Enter the OpenAI base URL")
        .setValue(this.plugin.settings.openAIBaseUrl)
        .onChange(async (value) => {
          this.plugin.settings.openAIBaseUrl = value;
          await this.plugin.saveSettings();
          this.plugin.updateOpenAIConfig();
        })
    );

    const openAIInfoEl = openAISettingsEl.createEl("div", {
      cls: "openai-settings",
    });
    openAIInfoEl
      .createEl("p", {
        text: "To obtain an OpenAI API key, visit the OpenAI API platform at ",
      })
      .createEl("a", {
        href: "https://platform.openai.com/",
        text: "OpenAI API Platform",
        target: "_blank",
      });
    openAIInfoEl.createEl("p", {
      text: "For more advanced settings, go to the Advanced Models tab.",
    });

    this.updateSettingsVisibility();

    return modelTabContent;
  }

  private updateSettingsVisibility(): void {
    const isPro = this.plugin.settings.usePro;
    const fileOrganizerSettingsEl = this.containerEl.querySelector(
      ".file-organizer-settings"
    );
    const openAISettingsEl = this.containerEl.querySelector(".openai-settings");

    if (fileOrganizerSettingsEl) {
      fileOrganizerSettingsEl.style.display = isPro ? "block" : "none";
    }
    if (openAISettingsEl) {
      openAISettingsEl.style.display = isPro ? "none" : "block";
    }
  }
}
