import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentEditor from "@/pages/admin/ContentEditor";

export default function ToolEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (id) {
      navigate(`/admin/content/${id}/edit`, { replace: true });
    } else if (!params.get("type")) {
      navigate("/admin/content/new?type=tool", { replace: true });
    }
  }, [id, navigate, params]);

  return <ContentEditor />;
}
