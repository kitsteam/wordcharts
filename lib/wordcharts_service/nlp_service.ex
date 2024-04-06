defmodule WordchartsService.NlpService do
  @word_tagger_path "/tagged_words"
  @ignore_classes ["$.", "$,", ".", ",", ")", "(", "``", "''", ~c"#", ~c":", "XY", "$("]
  @ignore_chars ["$", "(", ")", ".", ",", "`", "'", "/", "%"]

  @noun_classes ["NN", "NE", "NN$", "NNS", "NNS$", "NP", "NP$", "NPS", "NPS$", "NR", "NRS"]
  @verb_classes [
    "VV(FIN)",
    "VA(FIN)",
    "VM(FIN)",
    "VV(IMP)",
    "VA(IMP)",
    "VV(INF)",
    "VV(IZU)",
    "VA(INF)",
    "VM(INF)",
    "VV(PP)",
    "VM(PP)",
    "VA(PP)",
    "VB",
    "VBD",
    "VBG",
    "VBN",
    "VBZ",
    "HV",
    "HVD",
    "HVG",
    "HVN",
    "HVZ",
    "BE",
    "BED",
    "BEDZ",
    "BEG",
    "BEM",
    "BEN",
    "BER",
    "BEZ"
  ]
  @adj_classes ["ADJ(D)", "ADJ(A)", "JJ", "JJR", "JJS", "JJT"]
  @article_classes ["ART", "AT"]
  @con_classes ["KOUS", "KOUI", "KON", "KOKOM", "CC", "CS", "DTX"]
  @prep_classes ["APPR", "APPO", "APZR", "APPRART", "IN"]
  @adverb_classes ["ADV", "B", "RBR", "RBT", "RN", "RP"]
  @pron_classes [
    "PPER",
    "PRF",
    "PPOSAT",
    "PPOSS",
    "PDAT",
    "PDS",
    "PIAT",
    "PIS",
    "PRELAT",
    "PWAT",
    "PWS",
    "PWAV",
    "PROAV",
    "PN",
    "PN$",
    "PP$",
    "PP$$",
    "PPL",
    "PPLS",
    "PPO",
    "PPS",
    "PPSS"
  ]

  def tag_words(word_string, lang \\ "en", config \\ default_config()) do
    url = Keyword.get(config, :url, "") <> @word_tagger_path <> "?lang=" <> lang
    http_client = Keyword.get(config, :http_client)

    basic_auth_user = Keyword.get(config, :basic_auth_user_name, "")
    basic_auth_password = Keyword.get(config, :basic_auth_user_password, "")

    credentials =
      "#{basic_auth_user}:#{basic_auth_password}"
      |> Base.encode64()

    header =
      [{"Accept", "application/json"}]
      |> prepend_if_true(basic_auth_user != "", [{"Authorization", "Basic #{credentials}"}])

    case http_client.post(url, word_string, header) do
      {:ok, response} ->
        handle_ok(response)

      {:error, %HTTPoison.Error{reason: reason, id: _}} ->
        handle_error(reason)

      _ ->
        handle_error("unknown")
    end
  end

  defp handle_ok(response) do
    words =
      response.body
      |> Jason.decode!()
      |> Enum.reject(fn match ->
        Enum.member?(@ignore_classes, match["wordClass"]) ||
          String.trim(match["wordClass"]) == "" ||
          Enum.member?(@ignore_chars, match["original"])
      end)
      |> Enum.map(fn match ->
        %{
          "name" => match["original"],
          "grammatical_categories" => extract_tags(match["wordClass"])
        }
      end)

    {:ok, words}
  end

  defp handle_error(reason) do
    {:error, reason}
  end

  defp extract_tags(tag_string) do
    cond do
      Enum.member?(@noun_classes, tag_string) ->
        ["noun"]

      Enum.member?(@verb_classes, tag_string) ->
        ["verb"]

      Enum.member?(@adj_classes, tag_string) ->
        ["adjective"]

      Enum.member?(@article_classes, tag_string) ->
        ["article"]

      Enum.member?(@con_classes, tag_string) ->
        ["conjuncture"]

      Enum.member?(@prep_classes, tag_string) ->
        ["preposition"]

      Enum.member?(@adverb_classes, tag_string) ->
        ["adverb"]

      Enum.member?(@pron_classes, tag_string) ->
        ["pronoun"]

      true ->
        ["misc"]
    end
  end

  defp prepend_if_true(list, cond, extra) do
    if cond, do: extra ++ list, else: list
  end

  def default_config(), do: Application.get_env(:wordcharts, :nlp_service_client)
end
