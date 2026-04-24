// Keep a persistent mapping of ID -> DOM Element so the backend can refer to them later
const elementMap = new Map<number, HTMLElement>();
let currentId = 1;

export function inspectDOM() {
  elementMap.clear(); // Reset IDs on each inspection
  currentId = 1;
  const elementsNodes: any[] = [];

  const walkDOM = (node: HTMLElement) => {
    // Skip the AI Chatbot itself so the agent doesn't read its own messages
    if (node.id === "ai-chatbot-container") return;

    // Check visibility
    const style = window.getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      return;
    }

    const tagName = node.tagName.toLowerCase();
    const isInteractive =
      ["a", "button", "input", "select", "textarea"].includes(tagName) ||
      node.getAttribute("role") === "button" ||
      node.getAttribute("role") === "link" ||
      node.onclick !== null;

    const isHeading = ["h1", "h2", "h3"].includes(tagName);

    if (isInteractive || isHeading) {
      const id = currentId++;
      elementMap.set(id, node);

      let textContent =
        node.getAttribute("aria-label") ||
        node.getAttribute("placeholder") ||
        node.getAttribute("name") ||
        node.getAttribute("id") ||
        node.getAttribute("title") ||
        node.innerText ||
        "";
      textContent = textContent.trim().replace(/\n/g, " ").slice(0, 100);

      // Fallback for inputs without labels/placeholders so they are not silently skipped
      if (!textContent && (tagName === "input" || tagName === "textarea")) {
        textContent = `${tagName} field`;
      }

      const elData: any = {
        ref: id,
        tag: tagName,
        text: textContent,
      };

      if (tagName === "a") elData.href = node.getAttribute("href");
      if (
        node instanceof HTMLInputElement ||
        node instanceof HTMLTextAreaElement
      )
        elData.value = node.value;
      if (node.hasAttribute("disabled")) elData.disabled = true;

      if (textContent) {
        elementsNodes.push(elData);
      }
    }

    // Traverse children
    for (let i = 0; i < node.children.length; i++) {
      walkDOM(node.children[i] as HTMLElement);
    }
  };

  walkDOM(document.body);

  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
    elements: elementsNodes, // List of { ref, tag, text, ... }
  };
}

export function executeDOMAction(
  refId: number,
  action: "click" | "fill",
  data?: string,
) {
  const el = elementMap.get(refId);
  if (!el) {
    return { success: false, error: `Element with ref ${refId} not found` };
  }

  try {
    if (action === "click") {
      el.click();
      return { success: true, message: `Clicked element ${refId}` };
    } else if (action === "fill") {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.focus();
        el.value = data || "";
        // Dispatch React/Native events to ensure React state captures the change
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        return { success: true, message: `Filled element ${refId} with text` };
      }
      return { success: false, error: `Element ${refId} is not an input` };
    }
    return { success: false, error: `Action ${action} unsupported` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

