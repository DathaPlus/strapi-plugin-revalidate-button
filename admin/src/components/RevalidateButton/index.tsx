import React, { memo, useEffect } from "react";
import { useIntl } from "react-intl";
import { Button } from "@strapi/design-system";
import { Play } from "@strapi/icons";
import { useQuery } from "react-query";

import { unstable_useContentManagerContext as useContentManagerContext } from "@strapi/strapi/admin";
import { useFetchClient } from "@strapi/strapi/admin";
import { useNotification } from "@strapi/strapi/admin";

import getTrad from "../../utils/getTrad";

interface FormContext {
  initialValues: { slug: string; publishedAt?: string };
  values: { slug: string; publishedAt?: string };
}

const RevalidateButton = () => {
  const { slug, form } = useContentManagerContext();

  // Cast form to the correct type
  const { initialValues } = form as FormContext;

  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const QUERY_KEY = "webhooks";

  const {
    isLoading: isWebhooksLoading,
    data: webhooks,
    error: webhooksError,
  } = useQuery(QUERY_KEY, async () => {
    const {
      data: { data },
    } = await get("/admin/webhooks");
    return data;
  });

  const handleClick = async (model) => {
    try {
      const webhook = webhooks.find((item) => item.name === "Revalidate");
      if (webhook) {
        await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            entry: { slug: initialValues?.slug || null },
          }),
        });
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: "notification.success.revalidate",
            defaultMessage: `Revalidate request sent for slug: ${initialValues?.slug}`,
          }),
        });
      }
    } catch (error) {
      toggleNotification({
        type: "warning",
        message: formatMessage({
          id: "notification.error.revalidate",
          defaultMessage: `Revalidate field error`,
        }),
      });
    }
  };

  useEffect(() => {
    if (webhooksError) {
      toggleNotification({
        type: "warning",
        message: formatMessage({
          id: "notification.error.revalidate",
          defaultMessage: `Error loading ${QUERY_KEY}`,
        }),
      });
    }
  }, [webhooksError]);

  return !isWebhooksLoading && initialValues?.publishedAt ? (
    <Button
      onClick={handleClick}
      size="M"
      startIcon={<Play />}
      variant="success"
      style={{ width: "100%" }}
    >
      {formatMessage({
        id: getTrad("form.button.revalidate"),
        defaultMessage: "Revalidate",
      })}
    </Button>
  ) : (
    <></>
  );
};

export default memo(RevalidateButton);
