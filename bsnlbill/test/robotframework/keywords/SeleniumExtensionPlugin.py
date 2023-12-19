from typing import Union

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.remote.webelement import WebElement
from SeleniumLibrary.base import LibraryComponent, keyword

class SeleniumExtensionPlugin(LibraryComponent):

    def __init__(self, ctx):
        LibraryComponent.__init__(self, ctx)

    @keyword
    def get_css_property_value(self, locator: Union[WebElement, str], property: str):
        """Returns the value of the CSS ``property`` of the element ``locator``.
        """
        self.info(f"Getting CSS property '{property}' value of element '{locator}'.")
        element = self.find_element(locator)
        value = element.value_of_css_property(property)
        return value

    @keyword
    def mouse_move_by_offset(self, xoffset: float, yoffset: float):
        """Simulates moving the mouse cursor from its current position by ``xoffset/yoffset``.
        """
        self.info(f"Simulating Mouse Move by offset '{xoffset}:{yoffset}'.")
        action = ActionChains(self.driver)
        action.move_by_offset(xoffset, yoffset)
        action.perform()

    @keyword
    def mouse_up(self, locator: Union[WebElement, str, None] = None):
        """Simulates releasing the left mouse button on the element ``locator``.

        If ``locator`` is not passed, then releasing the left mouse button
        on the actual mouse position.

        See the `Locating elements` section for details about the locator
        syntax.

        """
        self.info(f"Simulating Mouse Up on element '{locator}'.")
        element = None if locator is None else self.find_element(locator)
        ActionChains(self.driver).release(element).perform()

    @keyword
    def mouse_move_to_element_with_offset(self,locator: Union[WebElement, str]):
        action = ActionChains(self.driver)
        element= self.find_element(locator)
        action.move_to_element_with_offset(element,0,0).click().perform()
