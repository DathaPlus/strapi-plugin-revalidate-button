/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import pluginId from "../../pluginId";

const Initializer = ({
  setPlugin,
}: {
  setPlugin: (pluginId: string) => void;
}) => {
  const ref = useRef<any>(null);
  ref.current = setPlugin;

  useEffect(() => {
    ref.current(pluginId);
  }, []);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer;
